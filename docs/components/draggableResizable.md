# draggableResizable

### Basic

The most basic component, without any props, free to move even outside the parent element.

~~~vue
<draggable-resizable>
  <p>You can drag me around and resize me as you wish.</p>
</draggable-resizable>
~~~

::: demo
<template>
  <div class="flex flex-center">
    <div style="height: 80vh; width: 80vh; border: 3px solid #FD746C; position: relative;">
      <draggable-resizable :w="300" :h="300" :parent="true" :min-width="200" :min-height="200">
        <h2>This is some text content...</h2>
      </draggable-resizable>
    </div>

  </div>
</template>

<script>
  // import MessageDialogue from '../components/MessageDialogue.vue';
  // import DragAndResize from '../components/drag-and-resize.vue';


  export default {
    name: 'DraggableResizableDemo',
    // components: {
    //   // MessageDialogue,
    //   DragAndResize,
    // }
  };
</script>
:::

### Basic with active control

A basic component, with <b>`active`</b> prop to control the active state from outside the component.

~~~vue
<draggable-resizable :active.sync="active">
  <p>Controlling the active state from outside the component by providing the <b>:active</b> prop.</p>
</draggable-resizable>
~~~

### Basic with "auto" width and height

A basic component with initial values for <b>`w`</b> and <b>`h`</b> props set to "auto". As soon as the component is resized their values fall back to numbers.

~~~vue
<draggable-resizable w="auto" h="auto">
  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate aperiam explicabo animi expedita unde perspiciatis quae, consequatur consequuntur libero assumenda, accusantium repellat illo asperiores molestiae ea quasi distinctio, aspernatur saepe!</p>
</draggable-resizable>
~~~

### Basic with axis prop

A basic component, with <b>`axis`</b> prop to control on which axis it is draggable. Suitable values are `x`, `y` or `both`.

~~~vue
<draggable-resizable :axis="axis">
  <p>Draggable on {{ axis }} axis.</p>
</draggable-resizable>
~~~

### Basic with Drag Handle

A basic component, that can be dragged only through a handle, specified by the prop <b>`drag-handle`</b> and a valid CSS selector.

~~~vue
<draggable-resizable style="border: 1px solid black;" :drag-handle="'.drag-handle'">
  <div class="drag-handle">Drag Only Here</div>
</draggable-resizable>
~~~

### Basic with handles prop

You can choose what handles to provide to the component using the <b>`handles`</b> prop, which accepts an array of handles. For example, if you want to costrain resizing only on horizontal axis you can provide only left and right handles `:handles="['ml','mr']"`.

~~~vue
<draggable-resizable :prevent-deactivation="true" :handles="['tl','tm','tr','mr','br','bm','bl','ml']">
  <p>Enable/disable handles.</p>
</draggable-resizable>
~~~

### Component not resizable

A basic component, with <b>`resizable`</b> prop set to `false`, so it's not resizable.

~~~vue
<draggable-resizable :resizable="false">
  <p>Basic component that is not resizable.</p>
</draggable-resizable>
~~~

## Callbacks

#### onDrag callback

A component with <b>`onDrag`</b> prop that accepts a function that gets called on dragging. If the function returns `false`, the drag action is cancelled.

~~~vue
<draggable-resizable :on-drag="onDragCallback">
</draggable-resizable>

function onDragStartCallback(x, y){
  if ((x > 100 && x < 400) && (y > 100 && y < 400)) {
    return false
  }
}
~~~

#### onDragStart callback

A component, with <b>`onDragStart`</b> prop that accepts a function that gets called when dragging starts (element is clicked or touched). If the function returns `false`, the action is cancelled. You can use this function to prevent bubbling of events.

~~~vue
<draggable-resizable :on-drag-start="onDragStartCallback">
  <p>Passing a callback to the component that gets called as soon as the component is clicked.</p>
</draggable-resizable>

function onDragStartCallback(ev){
   ...
   // return false; — for cancel
}
~~~

#### onResize callback

A component with <b>`onResize`</b> prop that accepts a function that gets called on resizing. If the function returns `false`, the action is cancelled.

~~~vue
<draggable-resizable :on-resize="onResizeCallback"></draggable-resizable>

function onResizeCallback(handle, x, y, width, height){
  if (width > 200 && height > 200) {
    return false
  }
}
~~~

#### onResizeStart callback

A component, with <b>`onResizeStart`</b> prop that accepts a function that gets called when dragging starts (element is clicked or touched). If the function returns `false`, the resizing action is cancelled. You can use this function to prevent bubbling of events.

~~~vue
<draggable-resizable :on-resize-start="onResizeStartCallback">
  <p>Passing a callback to the component that gets called as soon as the component is resized.</p>
</draggable-resizable>

function onResizeStartCallback(handle, ev){
   ...
   // return false; — for cancel
}
~~~

## Events

#### Activated and deactivated events

The `activated()` event is emitted when the component gets activated. The `deactivated()` event is emitted when the component gets deactivated.

~~~vue
<draggable-resizable :w="200" :h="200" @activated="onActivated" @deactivated="onDeactivated">
  <p v-if="active">The component has been activated.</p>
</draggable-resizable>

export default () => ({
  [...]

  methods: {
    onActivated () {
      this.active = true
    },
    onDeactivated () {
      this.active = false
    }
  }
})
~~~

#### Dragging and dragstop events

The `dragging(x, y)` event is emitted when the component is dragged. The `dragstop(x, y)` event is emmitted when the dragging stops.

~~~vue
<draggable-resizable :w="200" :h="200" @dragging="onDrag" @dragstop="onDragStop">
  <p>{{ dragging ? 'You are dragging me crazy' : 'Standing still' }}</p>
</draggable-resizable>

export default () => ({
  [...]

  methods: {
    onDrag: function (x, y) {
      this.dragging = true
      this.x = x
      this.y = y
    },
    onDragStop: function (x, y) {
      this.dragging = false
    }
  }
})
~~~

#### Resizing and resizestop events

The `resizing(x, y, width, height)` event is emitted when the component is resized. The `resizestop(x, y, width, height)` event is emmitted when the resizing stops.

~~~vue
<draggable-resizable :w="200" :h="200" :x="0" :y="0" @resizing="onResize" @resizestop="onResizeStop">
  <p>{{ resizing ? 'You are resizing me crazy' : 'This is my favourite shape' }}</p>
</draggable-resizable>

export default () => ({
  [...]

  methods: {
    onResize: function (x, y, width, height) {
      this.resizing = true
      this.x = x
      this.y = y
      this.width = width
      this.height = height
    },
    onResizeStop: function (x, y, width, height) {
      this.resizing = false
    }
  }
})
~~~

## Grid

#### Grid 20x20 pixels

A basic component, with <b>`grid=[20,20]`</b> prop to set the dimensions of grid cells (height and width in pixels).

~~~vue
<draggable-resizable :grid=[20,20]>
  <p>Grid 20x20 starting from the top-left corner</p>
</draggable-resizable>
~~~

#### Grid 20x20 pixels with 10x10 offset

The grid is always calculated from the upper-left corner of the component. In this example you can see that it has an offset relative to the parent element. This is important for components costrained in parent elements.

~~~vue
<draggable-resizable :grid="[20,20]" :x="10" :y="10">
  <p>Grid 20x20 starting with a 10x10 offset</p>
</draggable-resizable>
~~~

A basic component, with <b>`grid=[20,40]`</b> prop to set the dimensions of grid cells (height and width in pixels).

~~~vue
<draggable-resizable :grid=[20,40]>
  <p>Grid 20x40 starting from the top-left corner</p>
</draggable-resizable>
~~~

#### Grid 20x40 pixels with 10x10 offset and maxHeight, maxWidth, minHeight, minWidth values

If you provide `maxHeight` and `maxWidth` values that are higer than the respective grid values, you can notice that resizing stops to the lower suitable value. For example on the `x` axis the lowest valid value that respects `maxWidth` and `grid[x]` constraint is 80. The same applies for the `y` axis.

~~~vue
<draggable-resizable :grid="[20,40]" :x="10" :y="20" :maxHeight="290" :maxWidth="290">
  <p>Grid 20x40 starting with a 10x20 offset and max height, max width values equal to 290.</p>
</draggable-resizable>
~~~

If you provide `minHeight` and `minWidth` values that are lower than the respective grid values, you can notice that resizing stops to the lowest suitable value. For example on the `x` axis the lowest valid value that respects `minWidth` and `grid[x]` constraint is 40. The same applies for the `y` axis.

~~~vue
<draggable-resizable :grid="[20,40]" :x="10" :y="20" :minHeight="30" :minWidth="30">
  <p>Grid 20x40 starting with a 10x20 offset and min height, min width values equal to 30.</p>
</draggable-resizable>
~~~

## Styling

#### Component with custom class name on active state

Component with a custom class name on active state, provided with the prop <b>`class-name-active`</b>.

~~~vue
<draggable-resizable class-name-active="custom-class-active" class-name="custom-class">
  <p>You can provide a default class name for the component when it's active using the <b>class-name-active</b> prop.</p>
</draggable-resizable>
~~~

~~~css
.custom-class {
    background-color: green;
    border: 1px solid red;
    -webkit-transition: background-color 200ms linear;
    -ms-transition: background-color 200ms linear;
    transition: background-color 200ms linear;
}

.custom-class-active {
    border: 1px solid black;
    -webkit-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
    box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
}
~~~

#### Component with custom class name handles

Component with a custom class for handle, provided with the prop <b>`class-name-handle`</b>. In this way you can style each handle separately.

__Remember to set `position: absolute` for the handle class__

~~~vue
<draggable-resizable class-name-handle="my-handle-class">
  <p>You can provide a default class name for handle using the <b>class-name-handle</b> prop.</p>
</draggable-resizable>
~~~

~~~css
.my-handle-class {
    position: absolute.
    background-color: pink;
    border: 1px solid black;
    border-radius: 50%;
    height: 14px;
    width: 14px;
    box-model: border-box;
    -webkit-transition: all 300ms linear;
    -ms-transition: all 300ms linear;
    transition: all 300ms linear;
}

.my-handle-class-tl {
  top: -14px;
  left: -14px;
  cursor: nw-resize;
}

.my-handle-class-tm {
  top: -14px;
  left: 50%;
  margin-left: -7px;
  cursor: n-resize;
}

.my-handle-class-tr {
  top: -14px;
  right: -14px;
  cursor: ne-resize;
}

.my-handle-class-ml {
  top: 50%;
  margin-top: -7px;
  left: -14px;
  cursor: w-resize;
}

.my-handle-class-mr {
  top: 50%;
  margin-top: -7px;
  right: -14px;
  cursor: e-resize;
}

.my-handle-class-bl {
  bottom: -14px;
  left: -14px;
  cursor: sw-resize;
}

.my-handle-class-bm {
  bottom: -14px;
  left: 50%;
  margin-left: -7px;
  cursor: s-resize;
}

.my-handle-class-br {
  bottom: -14px;
  right: -14px;
  cursor: se-resize;
}

.my-handle-class-tl:hover,
.my-handle-class-tr:hover,
.my-handle-class-bl:hover,
.my-handle-class-br:hover {
    background-color: red;
    transform: scale(1.4);
}
~~~

#### Component with custom class name on dragging

Component with a custom class name on dragging, provided with the prop <b>`class-name-dragging`</b>.

~~~vue
<draggable-resizable class-name-dragging="my-dragging-class" class-name="my-class">
  <p>You can provide a default class name for the component when it's dragging using the <b>class-name-dragging</b> prop.</p>
</draggable-resizable>
~~~

~~~css
.my-class {
    background-color: green;
    border: 1px solid red;
    -webkit-transition: background-color 200ms linear;
    -ms-transition: background-color 200ms linear;
    transition: background-color 200ms linear;
}

.my-dragging-class {
    background-color: red;
    border: 1px solid black;
}
~~~

#### Component with custom markup for handles

Component with custom markup for handles, provided by [VueJS named slots](https://vuejs.org/v2/guide/components-slots.html#Named-Slots) (e.g. `slot="tl"`).

~~~vue
<draggable-resizable class-name-handle="emoji-handles">
  <p>The first child will populate the default slot.</p>

  <div slot="tl">😀</div>
  <div slot="tm">😀</div>
  <div slot="tr">😀</div>
  <div slot="mr">😀</div>
  <div slot="br">😀</div>
  <div slot="bm">😀</div>
  <div slot="bl">😀</div>
  <div slot="ml">😀</div>
</draggable-resizable>
~~~

#### Component with custom class name on resizing

Component with a custom class name on resizing, provided with the prop <b>`class-name-resizing`</b>.

~~~vue
<draggable-resizable class-name-resizing="my-resizing-class" class-name="my-class">
  <p>You can provide a default class name for the component when it's resizing using the <b>class-name-resizing</b> prop.</p>
</draggable-resizable>
~~~

~~~css
.my-class {
    background-color: green;
    border: 1px solid red;
    -webkit-transition: background-color 200ms linear;
    -ms-transition: background-color 200ms linear;
    transition: background-color 200ms linear;
}

.my-resizing-class {
    background-color: blue;
    border: 1px solid black;
    color: white;
}
~~~

#### Component with custom class name

Component with a custom class name, provided with the prop <b>`class-name`</b>.

~~~vue
<draggable-resizable class-name="my-class">
  <p>You can provide a default class name for the component using the <b>class-name</b> prop.</p>
</draggable-resizable>
~~~

~~~css
.my-class {
    background-color: green;
    border: 1px solid red;
}
~~~



## Props

Name                         | Type           | Default                                          | required | Description
-----------------            | :----------:   | :----------:                                     | :------: | ------------------
className                    | String         | 'vdr'                                            | false    | 
classNameDraggable           | String         | 'draggable'                                      | false    | 
classNameResizable           | String         | 'resizable'                                      | false    | 
classNameDragging            | String         | 'dragging'                                       | false    | 
classNameResizing            | String         | 'resizing'                                       | false    | 
classNameActive              | String         | 'active'                                         | false    | 
classNameHandle              | String         | 'handle'                                         | false    | 
disableUserSelect            | Boolean        | true                                             | false    | 
enableNativeDrag             | Boolean        | false                                            | false    | 
preventDeactivation          | Boolean        | false                                            | false    | 
active                       | Boolean        | false                                            | false    | 
draggable                    | Boolean        | true                                             | false    | 
resizable                    | Boolean        | true                                             | false    | 
lockAspectRatio              | Boolean        | false                                            | false    | 
w                            | Number, String | 200                                              | false    | 
h                            | Number, String | 200                                              | false    | 
minWidth                     | Number         | 0                                                | false    | 
minHeight                    | Number         | 0                                                | false    | 
maxWidth                     | Number         | null                                             | false    | 
maxHeight                    | Number         | null                                             | false    | 
x                            | Number         | 0                                                | false    | 
y                            | Number         | 0                                                | false    | 
z                            | String, Number | 'auto'                                           | false    | 
handles                      | Array          | ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'] | false    | 
dragHandle                   | String         | null                                             | false    | 
dragCancel                   | String         | null                                             | false    | 
axis                         | String         | 'both'                                           | false    | 
grid                         | Array          | [1, 1]                                           | false    | 
parent                       | Boolean        | false                                            | false    | 
scale                        | Number, Array  | 1                                                | false    | 
onDragStart                  | Function       | true                                             | false    | 
onDrag                       | Function       | true                                             | false    | 
onResizeStart                | Function       | true                                             | false    | 
onResize                     | Function       | true                                             | false    | 

## Slots

Name        | Slot props  | Description
--------    | ----------- | -----------
default     |             |
handle      |             |

## Methods

Name             | Params            | Description
---------------- | ----------------- | -----------
None             |                   |

## Events

Name             | Params            | Description
---------------- | ----------------- | -----------
None             |                   |
