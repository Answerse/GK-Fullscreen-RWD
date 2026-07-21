import http.client
import re

conn = http.client.HTTPConnection('localhost', 8080)

# Get the HTML
conn.request('GET', '/agriculture.html')
r = conn.getresponse()
html = r.read().decode('utf-8')

# Find all CSS links
css_links = re.findall(r'href=["\']([^"\']*\.css[^"\']*)["\']', html)
print('CSS files found:')
for link in css_links:
    print(f'  {link}')

# Find section elements
print('\nAll <section> elements:')
for m in re.finditer(r'<section\s+([^>]*?)>', html):
    attrs = m.group(1)
    print(f'  <section {attrs}>')

# Check for brand-bar
if 'brand-bar' in html:
    print('\nbrand-bar exists in HTML')

# Find contact section specifically
for m in re.finditer(r'<section\s+[^>]*id=["\'](contact[^"\']*)["\'][^>]*>', html):
    print(f'\nContact section found: id="{m.group(1)}"')
    # Get content around it
    start = max(0, m.start() - 200)
    end = min(len(html), m.end() + 500)
    print(f'Context: ...{html[start:end]}...')

# Find the last section in the document
all_tags = re.findall(r'(<(?:section|div|footer)\b[^>]*>)', html)
print(f'\nTotal structural tags found: {len(all_tags)}')
for tag in all_tags[-5:]:
    print(f'  Last tags: {tag}')

# Read the CSS files to understand layout
print('\n\n=== Fetching CSS files ===')
for css_link in css_links:
    if css_link.startswith('http'):
        continue
    conn.request('GET', '/' + css_link.lstrip('/'))
    r2 = conn.getresponse()
    css = r2.read().decode('utf-8')
    print(f'\n--- {css_link} (first 50 lines) ---')
    lines = css.split('\n')
    for line in lines[:50]:
        print(line)