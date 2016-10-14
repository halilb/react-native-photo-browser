# React Native Photo Browser

A full screen image gallery with captions, selections and grid view support for react-native. Layout and API design are inspired by great [MWPhotoBrowser](https://github.com/mwaterfall/MWPhotoBrowser) library.

The component has both iOS and Android support.

### Neogrowth Contribution
Neogrowth bring the support for zoom in and zoom out of the image and some minor bug fixes are taken care. For which the following is the dependency.

[react-native-photo-view](https://github.com/alwx/react-native-photo-view/)



![](screenshots/photo-browser.gif)

![](screenshots/screenshot-1.png)
![](screenshots/screenshot-2.png)

### Installation
```npm install https://github.com/NeoGrowth-Credit-Pvt-Limited/react-native-photo-browser.git --save```

#### android/settings.gradle
Add the following line

    include ':react-native-photo-view'
    project(':react-native-photo-view').projectDir = file('../node_modules/react-native-photo-view/android')

#### android/build.gradle
add `compile project` in  dependencies

    dependencies {
      .
      .
      compile project(':react-native-photo-view')
    }

#### android/app/build.gradle
    allprojects {
        repositories {
            mavenLocal()
            jcenter()
            maven { url "https://jitpack.io" } // <-- Add this
            maven {
                // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
                url "$rootDir/../node_modules/react-native/android"
            }
        }
    }

#### MainApplication.java

      import com.reactnative.photoview.PhotoViewPackage; // add this import
      public class MainApplication extends Application implements ReactApplication {

      private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        protected boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
              new RNSimpleAlertDialogPackage(),
              .
              .
              .
              new PhotoViewPackage() // add this manager
          );
        }
      };

      @Override
      public ReactNativeHost getReactNativeHost() {
          return mReactNativeHost;
      }
    }

### Properties

| Prop | Type | Description | Default |
|---|---|---|---|
|**`mediaList`**|Array\<Media\>|List of [media objects](#media-object) to display.|`[]`|
|**`initialIndex`**|Number|Sets the visible photo initially.|`0`|
|**`alwaysShowControls`**|Boolean|Allows to control whether the bars and controls are always visible or whether they fade away to show the photo full.|`false`|
|**`displayActionButton`**|Boolean|Show action button to allow sharing, copying, etc.|`false`|
|**`displayNavArrows`**|Boolean|Whether to display left and right nav arrows on bottom toolbar.|`false`|
|**`enableGrid`**|Boolean|Whether to allow the viewing of all the photo thumbnails on a grid.|`true`|
|**`startOnGrid`**|Boolean|Whether to start on the grid of thumbnails instead of the first photo.|`false`|
|**`displaySelectionButtons`**|Boolean|Whether selection buttons are shown on each image.|`false`|
|**`useCircleProgress`**_iOS_|Boolean|Displays Progress.Circle instead of default Progress.Bar for full screen photos. Check [Progress](#progress-component) section for more info.|`false`|
|**`onSelectionChanged`**|Function|Called when a media item is selected or unselected.|`(media, index, isSelected) => {}`|
|**`onActionButton`**|Function|Called when action button is pressed for a photo. Your application should handle sharing process, please see [Sharing](#sharing) section for more information. If you don't provide this method, action button tap event will simply be ignored.|`(media, index) => {}`|
|**`onBack`**|Function|Called when back button is tapped.|`() => {}`|
|**`itemPerRow`**|Number|Sets images amount in grid row.|`3`|

### Media Object

```js
const media = {
  thumb: '', // thumbnail version of the photo to be displayed in grid view. actual photo is used if thumb is not provided
  photo: '', // a remote photo or local media url
  caption: '', // photo caption to be displayed
  selected: true, // set the photo selected initially(default is false)
};
```


### Progress Component

#### Android

Built-in [ActivityIndicator](https://facebook.github.io/react-native/docs/activityindicator.html) component is used for Android. Any additional configuration is not needed. [ProgressBarAndroid](https://facebook.github.io/react-native/docs/progressbarandroid.html) is deprecated now.

#### iOS

[react-native-progress](https://github.com/oblador/react-native-progress) component is used as progress indicator. The default progress component is `Progress.Bar`. You can also use `Progress.Circle` component by simply using `useCircleProgress` prop, and adding `ReactART` library to your Xcode project. For more information please check out [react-native-progress repo](https://github.com/oblador/react-native-progress#reactart-based-components) and [React Native documentation](http://facebook.github.io/react-native/docs/linking-libraries-ios.html#content).

### Sharing

I tried delivering sharing photo feature but it was complicated to provide for iOS and android out of the box. I now believe it's a better idea to separate sharing logic into another module. Please check out Example project to see a basic ActionSheetIOS implementation for iOS. You may also use available sharing libraries such as [react-native-activity-view](https://github.com/naoufal/react-native-activity-view) and [react-native-share](https://github.com/EstebanFuentealba/react-native-share).

### Examples

See [PhotoBrowserExample.js](Example/PhotoBrowserExample.js) file.

Follow those steps to run the example:

1. Clone the repo `git clone https://github.com/NeoGrowth-Credit-Pvt-Limited/react-native-photo-browser/Example`
2. Install dependencies `npm install`
3. Follow [official instructions](https://facebook.github.io/react-native/docs/getting-started.html) to run the example project in a simulator or device.

### Roadmap
- [x] Android support
- [ ] Improve performance for bigger collections
- [ ] Video support
- [ ] Photo zoom
- [ ] Zooming photos to fill the screen

### Licence
[MIT](http://opensource.org/licenses/mit-license.html)
