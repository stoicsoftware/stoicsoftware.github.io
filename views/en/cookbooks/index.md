---
layout: page
eleventyNavigation:
  key: cookbooks
  title: Cookbooks
eleventyImport:
  collections: ['cookbooks']
---
# SuiteScript Cookbooks

Practical examples of common SuiteScript tasks

<ul>
{%- for cookbook in collections.cookbooks -%}
  <li{% if page.url == cookbook.url %} aria-current='page'{% endif %}>
    <a href='{{ cookbook.url }}'>{{ cookbook.data.eleventyNavigation.title }}</a>
  </li>
{%- endfor -%}
</ul>
