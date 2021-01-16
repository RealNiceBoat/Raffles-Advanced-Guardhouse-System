from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.request
import string
import atexit
import sys
import json
import socket
import codecs
import os

webpg_name = "index.html"
closing = False

class HTMLHandler (BaseHTTPRequestHandler):
        def do_GET(self):
                if(self.path=="/"):
                        self.send_response(302)
                        self.send_header('Location',self.path+webpg_name)
                        self.end_headers()
                        return
                else:
                        self.send_response(200)
                        ftype = self.path.split(".")[-1]
                        if ftype == "png":
                                self.send_header("Content-type",'image/png')
                        elif ftype == "jpg":
                                self.send_header("Content-type",'image/jpeg')
                        elif ftype == "gif":
                                self.send_header("Content-type",'image/gif')
                        elif ftype == "bmp":
                                self.send_header("Content-type",'image/bmp')
                        elif ftype == "html":
                                self.send_header("Content-type",'text/html')
                        elif ftype == "css":
                                self.send_header("Content-type",'text/css')
                        elif ftype == "js":
                                self.send_header("Content-type","text/js")
                        elif ftype == "svg":
                                self.send_header("Content-type",'image/svg+xml')
                        elif ftype == "woff":
                                self.send_header("Content-type",'appplication/font-woff')
                        else:
                                self.send_header("Content-type","application/"+str(ftype))
                        self.end_headers()
                        try:
                                data = open("."+self.path,'rb')
                        except:
                                self.send_response(404)
                                self.end_headers()
                                return
                        stream = bytes("","utf_8")
                        for line in data:
                                stream += line
                        self.send_header('Content-length',sys.getsizeof(stream))
                        self.wfile.write(stream)
                return
        
        def do_POST(self):
                pass
        def do_PUT(self):
                pass

        def do_DEL(self):
                pass


@atexit.register
def leaving():
        closing = True

def get_ip_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    return s.getsockname()[0]

def run(port=80,server_class=HTTPServer, handler_class=HTMLHandler):
        print("Starting...")
        address = (get_ip_address(),port)
        httpd = server_class(address,handler_class)
        print("Running on %s:%d..."%address)
        while(not closing):
                httpd.handle_request()
        print("Shutting down...")

ans = ""
while(ans == ""):
        ans = input("Use default settings? (Y/N)")
        if ans == 'Y' or ans == 'y':
                default = True
        elif ans == 'N' or ans == 'n':
                default = False
        else:
                ans = ""

if(default):
        run()
else:
        port = -1
        while(port<1):
                try:
                        port = int(input("Port Number: "))
                except Error:
                        port = -1

        run(port)
