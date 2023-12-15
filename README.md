# Graphene Components

Set of standards-based web components following the [IBM Carbon Design System](https://carbondesignsystem.com).

## Why?

> **Warning:** Rant ahead.

I know. I can hear it now. Why not use the components provided by IBM? They even provide standards-based components. Well, my friends, in this case it has nothing to do with telling React to go f*** itself (a rarity for me), but rather with the design itself. Some of it I just downright disagree with, and some of it has just evolved into places I do not need to go.

For example, the date picker component in Carbon. The drop down calendar and the input field have to be the same length. A calendar is much wider than a field that simply needs to contain "XXXX-XX-XX" or the likes. So you end up with this massive, space-hogging, field that makes layout tedious and lopsided.

Or take for example the input component in Carbon. There used to be two lines above the field. One for a label, and one for a helper. An additional label was available below the field for an error message. In the current Carbon, the helper label above the field is gone, and moved to the bottom. When you have an error message to display, the helper content is replaced with that message. Put another way, in the moment where you most need the helper content, it is hidden from you. D'oh!

Oh, the input component. Then there is the "read only" state. When you set the read only state on the current Carbon input, a reduced opacity is applied to the the text provided by the user in that field. Effectively, you say "read only" and Carbon says, how about just not read at all. No! I still want the text to be readable, but I do not want the user to be able to interact with the content. Remove the chrome from the component. Fine. Reducing the opacity is for a disabled state.

It is little things like these, spread throughout Carbon, that just chap my hide. I like the overall design system. I just struggle with some of the choices made at for the web components. So I rolled my own, and here we are. Whew! Now I have worked a metric crap tonne more than I needed to work, but I have Carbon components that function the way I want them to. So there! 🙃

> This is a personal passion project. ❤️ It is not sponsored by IBM. It is not sanctioned by IBM. It is not affiliated with IBM. I just happen to be an ex-IBM employee that wanted specific tweaks to Carbon components for his development projects.

## Getting Started

You can use these components too! I update these components as my projects drive new features. If that works for you, there are two parts you will need to get going. First is a CSS file for fonts (IBM Plex Sans) and a few styles that are used across multiple compoonents. Second is the components themselves. You can load the components in two ways: all at once or a la carte.

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

- ✅ Box ⚠️
- ✅ HBox ⚠️
- ✅ Header
- ✅ Stack ⚠️
- ✅ Tabs
- ✅ VBox ⚠️

## Controls   

- ✅ Avatar ⚠️
- ✅ Button
- ✅ Calendar
- ✅ Checkbox
- ✈️ Date Picker
- ✅ Icon
- ✅ Icon Button
- ✅ Input
- ✅ Label
- ✈️ Radar Chart
- ✅ Spacer
- ✅ Tab
- ✅ Tag
- ✅ Text Area

✅ Implemented (14)   
✈️ In-flight/progress (1)  
📆 Planned  (0)   
❓ To be determined (0)  
⚠️ Not part of IBM Carbon (5)
