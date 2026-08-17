import json
import urllib.request
import urllib.error
import uuid

LOGIN_URL = 'http://127.0.0.1:8000/api/admin/login/'
POST_URL = 'http://127.0.0.1:8000/api/admin/articles/'

creds = {'username': 'admin', 'password': 'admin123'}

req = urllib.request.Request(
    LOGIN_URL,
    data=json.dumps(creds).encode('utf-8'),
    headers={'Content-Type': 'application/json'},
)
res = urllib.request.urlopen(req, timeout=10)
body = res.read().decode('utf-8')
print('LOGIN OK', body)

token = json.loads(body)['token']

boundary = '----WebKitFormBoundary' + uuid.uuid4().hex
fields = {
    'title': 'Test article',
    'slug': 'test-article-' + uuid.uuid4().hex[:8],
    'excerpt': 'Short excerpt',
    'body': 'Body text',
    'published': 'true',
}

lines = []
for name, value in fields.items():
    lines.append('--' + boundary)
    lines.append(f'Content-Disposition: form-data; name="{name}"')
    lines.append('')
    lines.append(value)
lines.append('--' + boundary + '--')
lines.append('')

body_data = '\r\n'.join(lines).encode('utf-8')
req2 = urllib.request.Request(
    POST_URL,
    data=body_data,
    method='POST',
)
req2.add_header('Authorization', 'Bearer ' + token)
req2.add_header('Content-Type', 'multipart/form-data; boundary=' + boundary)

try:
    res2 = urllib.request.urlopen(req2, timeout=10)
    print('POST OK', res2.status, res2.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print('POST ERROR', e.code)
    print(e.read().decode('utf-8'))
except Exception as exc:
    print('POST EXCEPTION', exc)
