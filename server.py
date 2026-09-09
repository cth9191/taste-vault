"""Taste Vault's local server. Run: python server.py --port 4610"""
import argparse
import base64
import binascii
from datetime import date
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import re
import threading
from urllib.parse import urlparse
import uuid

MAX_IMAGE = 20 * 1024 * 1024
WRITE_LOCK = threading.Lock()


def image_extension(data):
    if data.startswith(b'\x89PNG\r\n\x1a\n'):
        return '.png'
    if data.startswith(b'\xff\xd8\xff'):
        return '.jpg'
    if data.startswith(b'RIFF') and data[8:12] == b'WEBP':
        return '.webp'
    raise ValueError('Choose a PNG, JPEG or WebP image.')


def add_reference(root, payload):
    if not isinstance(payload, dict):
        raise ValueError('The reference must be an object.')
    def string(name, limit, default=''):
        value = payload.get(name, default)
        if not isinstance(value, str) or len(value) > limit:
            raise ValueError(f'Invalid {name}.')
        return value.strip()
    title = string('title', 120)
    if not title:
        raise ValueError('Give your reference a name.')
    collection_id = string('collection', 120)
    note = string('note', 5000)
    recipe = string('imageRecipe', 5000)
    vocabulary = payload.get('vocabulary', [])
    if not isinstance(vocabulary, list) or len(vocabulary) > 30 or any(not isinstance(v, str) or len(v) > 200 for v in vocabulary):
        raise ValueError('Use up to 30 short vocabulary terms.')
    encoded = string('image', MAX_IMAGE * 4 // 3 + 8)
    try:
        image = base64.b64decode(encoded, validate=True)
    except (ValueError, binascii.Error) as exc:
        raise ValueError('Unable to read the image.') from exc
    if not image or len(image) > MAX_IMAGE:
        raise ValueError('Choose an image smaller than 20 MB.')
    extension = image_extension(image)
    with WRITE_LOCK:
        gallery_path = root / 'data' / 'gallery.json'
        gallery = json.loads(gallery_path.read_text(encoding='utf-8-sig'))
        collection = next((c for c in gallery['collections'] if c['id'] == collection_id), None)
        if not collection:
            raise ValueError('Choose an existing collection.')
        slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')[:65] or 'reference'
        identifier = slug + '-' + uuid.uuid4().hex[:10]
        entry = dict(id=identifier, file=identifier + extension, title=title,
                     collection=collection_id, family=collection['name'],
                     vocabulary=[v.strip() for v in vocabulary if v.strip()] or collection['vocabulary'],
                     note=note or 'Saved as a visual reference for ' + collection['name'] + '.',
                     added=date.today().isoformat(), imageRecipe=recipe or collection.get('imageStyle', ''),
                     heroUsage='Use the reference image to guide composition. Keep interface text and controls in code.')
        image_path = root / 'images' / entry['file']
        temp_path = gallery_path.with_name('gallery-' + uuid.uuid4().hex + '.tmp')
        gallery['entries'].insert(0, entry)
        try:
            with image_path.open('xb') as destination:
                destination.write(image)
            temp_path.write_text(json.dumps(gallery, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
            os.replace(temp_path, gallery_path)
        except Exception:
            image_path.unlink(missing_ok=True)
            temp_path.unlink(missing_ok=True)
            raise
    return entry


class VaultHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, directory=None, **kwargs):
        self.root = Path(directory).resolve()
        super().__init__(*args, directory=str(self.root), **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        super().end_headers()

    def list_directory(self, path):
        self.send_error(403, 'Directory listing is disabled')
        return None

    def do_GET(self):
        path = urlparse(self.path).path
        if any(segment.startswith('.') for segment in path.split('/') if segment):
            self.send_error(404)
            return
        if path == '/api/health':
            self.json_response(200, {'status': 'ok'})
            return
        if path == '/data/gallery.json':
            gallery = json.loads((self.root / 'data' / 'gallery.json').read_text(encoding='utf-8-sig'))
            gallery.setdefault('meta', {})['imagesPath'] = (self.root / 'images').as_posix() + '/'
            self.json_response(200, gallery)
            return
        super().do_GET()

    def json_response(self, status, payload):
        body = json.dumps(payload).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        self.connection.settimeout(30)
        if urlparse(self.path).path != '/api/references':
            self.json_response(404, {'error': 'Not found.'})
            return
        host = self.headers.get('Host', '')
        allowed = {f'127.0.0.1:{self.server.server_port}', f'localhost:{self.server.server_port}'}
        if host not in allowed or self.headers.get('Origin') not in {f'http://{host}'}:
            self.json_response(403, {'error': 'Add references from the local Taste Vault page.'})
            return
        if self.headers.get_content_type() != 'application/json':
            self.json_response(415, {'error': 'Expected a reference and image as JSON.'})
            return
        try:
            size = int(self.headers.get('Content-Length', '0'))
            if size <= 0 or size > MAX_IMAGE * 4 // 3 + 20000:
                self.json_response(413, {'error': 'Choose an image smaller than 20 MB.'})
                return
            payload = json.loads(self.rfile.read(size))
            entry = add_reference(self.root, payload)
            self.json_response(201, {'entry': entry})
        except (ValueError, UnicodeError) as error:
            self.json_response(400, {'error': str(error)})
        except Exception:
            self.log_error('Failed to save reference')
            self.json_response(500, {'error': 'Could not save the reference. Check that the library folder is writable.'})


def make_server(root, port):
    def handler(*args, **kwargs):
        return VaultHandler(*args, directory=root, **kwargs)
    return ThreadingHTTPServer(('127.0.0.1', port), handler)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=4610)
    args = parser.parse_args()
    server = make_server(Path(__file__).resolve().parent, args.port)
    print(f'Taste Vault is running at http://127.0.0.1:{server.server_port}', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
