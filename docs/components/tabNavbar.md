# tabNavbar

## Example

The following example is a tag `<tab-navbar />` written directly in the markdown file.

<tab-navbar></tab-navbar>

The code snippet can be written directly in markdown too. This could be useful especially when you only want to show a
portion of the demo codes.

``` vue
<tab-navbar></tab-navbar>
<tab-navbar />
```

### demo 1
<<< @/docs/.vuepress/components/tabNavbar.vue

## Props

Name                         | Type    | Default              | required | Description
-----                        | :----:  | :-------:            | -------- | -----------
value                        | Boolean | true                 | false    | To show or hide nav.
container                    | Boolean | false                | false    | Change nav from fixed to relative to its parent container.
navZindex                    | Number  | 2000                 | false    | change the z-index style for nav.
position                     | String  | 'top-right'          | false    | To change position of nav in respect to window or container. options: `'top-right', 'top-left', 'bottom-right', 'bottom-left'`
position_offset              | Number  | undefined            | false    | Changes position in `px` distance from top or bottom. example: `20, 5, 0`
no_num_icons                 | Boolean | false                | false    | Removes num icons from all links.
icon_colors                  | String  | '#000000'            | false    | Changes default color for all icons.
icon_colors_hover            | String  | '#ffffff'            | false    | Changes default color for all icons hover.
icon_color_backgrounds       | String  | '#ffffff'            | false    | Changes default background-color for all icons.
icon_color_backgrounds_hover | String  | 'rgba(0, 0, 0, 0.7)' | false    | Changes default background-color for all icons hover.
links                        | Array   | []                   | false    | List of objects that is used to create the links

### links props array object options
Name  | Type             | Default  | required | Description
----- | :----:           | :------: | -------- | -----------
label | String           | None     | true     | label text.
icon  | String           | None     | false    | icon name.
to    | String or object | None     | false    | uses vue-router link.
href  | String           | None     | false    | uses `a` tags `href` attribute.
img   | String           | None     | false    | uses `img` tags `src` attribute.

## Slots

Name     | Slot props  | Description
-------- | ----------- | -----------
None     |             |

## Methods

Name             | Params            | Description
---------------- | ----------------- | -----------
None             |                   |

## Events

Name             | Params            | Description
---------------- | ----------------- | -----------
None             |                   |
