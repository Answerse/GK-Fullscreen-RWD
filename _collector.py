#!/usr/bin/env python3
"""Simple HTTP server to collect measurements from the injected script."""
import http.server
import json
import urllib.parse
import sys

class CollectorHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed.query)
        
        if parsed.path == '/collect' and 'data' in params:
            try:
                data = json.loads(params['data'][0])
                # Store measurements in the server instance
                self.server.measurements = data
                print("\n=== MEASUREMENTS RECEIVED ===")
                print(json.dumps(data, indent=2, ensure_ascii=False))
                print("=== END ===\n")
            except Exception as e:
                print(f"Error parsing data: {e}", file=sys.stderr)
        
        # Return a 1x1 transparent GIF for the image beacon
        self.send_response(200)
        self.send_header('Content-Type', 'image/gif')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        self.end_headers()
        # 1x1 transparent GIF
        self.wfile.write(b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00\x21\xf9\x04\x00\x00\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b')
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.end_headers()
    
    def log_message(self, format, *args):
        pass  # Suppress default logging

def run_server():
    server = http.server.HTTPServer(('localhost', 8081), CollectorHandler)
    server.measurements = None
    print("Collector server running on http://localhost:8081")
    print("Waiting for measurements...")
    
    # Handle one request then check if we have measurements
    import select
    import time
    
    timeout = 30  # Wait up to 30 seconds
    start = time.time()
    
    while time.time() - start < timeout:
        ready = select.select([server], [], [], 0.5)
        if ready[0]:
            server.handle_request()
            if server.measurements:
                return server.measurements
        else:
            # Check if our timeout expired
            elapsed = time.time() - start
            if int(elapsed) % 5 == 0 and int(elapsed) > 0:
                print(f"  Waiting... ({int(elapsed)}s elapsed)")
    
    print("Timeout reached, no measurements received.")
    return None

if __name__ == '__main__':
    result = run_server()
    if result:
        # Output as JSON for parsing
        print("\n\nFINAL_RESULT:" + json.dumps(result, ensure_ascii=False))
    else:
        print("\n\nFINAL_RESULT:null")