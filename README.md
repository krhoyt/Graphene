# Graphite Components

Set of standards-based web components following the [BIm Carbon Design System](https://carbondesignsystem.com).

## Why?

- Web standards
- Minimal barrier to entry
- Easy to get started
- Easy to use
- No framework required
- No build required
- Works with frameworks
- Highly customizable

> This is a personal passion project. ❤️ It is not sponsored by IBM. It is not sanctioned by IBM. It is not affiliated with IBM. I just happen to be an ex-IBM employee that wanted a Vanilla web components with specific customizations for his development projects.

## Getting Started

You need two parts. First is a CSS file for fonts (Open Sans) and a few styles that are used across multiple compoonents. Second is the components themselves. You can load the components in two ways: all at once or a la carte.

### CSS

``` html
<link href="https://cdn.jsdelivr.net/npm/graphite-web-components@latest/graphite.css" rel="stylesheet">
```

### All At Once

While the overall size of the entire set of components is relatively small compared to most modern web sites, you should be cautious about using this approach. Everything will be loaded. This is great for development, or if you are using a majority of the components. It is not so great if you are only using a few components.

``` html
<script src="https://cdn.jsdelivr.net/npm/graphite-web-components@latest/graphite.js" type="module"></script>
```

### A La Carte

When loading a la carte, component dependencies are loaded by the components themselves.

``` html
<script src="https://cdn.jsdelivr.net/npm/graphite-web-components@latest/controls/button.js" type="module"></script>
```

That is it! Nope, there is no builder required. Nope, you do not `npm install` anything. No `git clone` of any repositories. No command line tools to setup the directories and dependencies in just the right way. All you need is an HTML page; add two tags and you are done. Welcome to web standards. 🤯

## Containers

- ✅ Box
- ✅ HBox
- ✅ Header
- ✅ Stack
- ✅ Tabs
- ✅ VBox

## Controls   

- ✅ Avatar
- ✅ Button
- ✅ Icon
- ✅ Icon Button
- ✅ Input
- ✅ Label
- ✅ Spacer
- ✅ Tab
- ✈️ Text Area

✅ Implemented (14)   
✈️ In-flight/progress (1)  
📆 Planned  (0)   
❓ To be determined (0)  
⚠️ Not part of IBM Carbon (3)
