# Test enviornment :: server

import pathlib

ROOT = pathlib.Path(__file__).parent.resolve()
SCRIPTS = ROOT.parent.resolve() / 'src'
CONTENT = ROOT.parent.resolve()

from http.server import BaseHTTPRequestHandler, HTTPServer


class RequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):

        request = self.path.lstrip('/')
        print(request)
        if request.endswith('.js'):
            if 'content' in request:
                print('h')
                path = CONTENT / request
            else:
                path = SCRIPTS / request
        else:
            path = ROOT / request


        if path.is_file() and path.suffix in ('.html', '.js'):
            self.send_response(200)
            self.send_header('Content-Type', {
                '.html' : 'text/html',
                '.js' : 'application/javascript'
            }[path.suffix])
            self.end_headers()
            self.wfile.write(path.read_bytes())
            return

        self.send_error(404)

server = HTTPServer(('localhost', 8000), RequestHandler)
server.serve_forever()