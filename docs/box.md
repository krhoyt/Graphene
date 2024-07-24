# Box

`<gr-box>` | `GRBox`

Flexbox container for elements spacing and alignment.

## Importing

``` html
<script src="https://cdn.jsdelivr.net/npm/rainforest-web-components@latest/components/box.js" type="module"></script>
```

## Examples

### Gap

``` html
<rf-box gap="16">
  <p>One</p>
  <p>Two</p>
  <p>Three</p>            
</rf-box>
```

### Direction

``` html
<rf-box direction="row">
  <p>One</p>
  <p>Two</p>
  <p>Three</p>            
</rf-box>    
```

### Margins and paddings - all sides

``` html
<rf-box margin="xxl" padding="xxl">
  <p>One</p>
  <p>Two</p>
  <p>Three</p>            
</rf-box>    
```

### Margins and paddings - one side

``` html
<rf-box style="margin: 0 0 0 32px; padding: 0 0 0 32px;">
  <p>One</p>
  <p>Two</p>
  <p>Three</p>            
</rf-box>    
```

### Float right

``` html
<rf-box float="right">
  <p>One</p>
  <p>Two</p>
  <p>Three</p>            
</rf-box>
```

## Slots

| Name | Description |
| --- | --- |
| (default) | Elements to layout in specified direction. |

## Attributes

| Name | Type | Description | Values | Default | Reflects |
| --- | --- | --- | --- | --- | --- |
| `direction` | `string` | CSS value specifying layout. | - | `column` | ✅ |
| `float` | `string` | Defines the floating behavior. | `left` \| `right` | `null` | ✅ |
| `gap` | `number` | Distance in pixels between contained elements. | - | `0` | ✅ |
| `hidden` | `boolean` | Removes element from DOM layout. | - | `false` | ✅ |
| `margin` | `string` | Adds margins to the element. | `n` \| `xxxs` \| `xxs` \| `xs` \| `s` \| `m` \| `l` \| `xl` \| `xxl` \| `xxxl` | `null` | ✅ |
| `padding` | `string` | Adds paddings to the element. | `n` \| `xxxs` \| `xxs` \| `xs` \| `s` \| `m` \| `l` \| `xl` \| `xxl` \| `xxxl` | `null` | ✅ |

## Events

None

## Methods

None

## Parts

None

## Variables

None

## Dependencies

None
