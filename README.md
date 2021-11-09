# Slideshow Plugin for Editor.js

Slideshow plugin for Editor.js: Allows users to add multiple images in a grid and slideshow layout.

![Screenshot1](https://github.com/ranemihir/editorjs-slideshow-tool/blob/main/1.png)

![Screenshot2](https://github.com/ranemihir/editorjs-slideshow-tool/blob/main/2.png)

![Screenshot3](https://github.com/ranemihir/editorjs-slideshow-tool/blob/main/3.png)

![Screenshot4](https://github.com/ranemihir/editorjs-slideshow-tool/blob/main/4.png)


## Commands

1. For production builds: `yarn build`
2. For Development: `yarn build:dev`

## Configuration syntax with Editor.js

```javascript
tools: {
    slideshow: {
        class: Slideshow,
        config: {
            /**
             * All the available image objects as an array.
             */ 
            imageData: [],
            /**
             * Base URL to fetch images from given names. 
             * In your case: https://res.cloudinary.com/fatcap/image/upload/.
             */ 
            cloudinaryBaseUrl: 'SomeBaseURL' 
        }
    },
},
```

Checkout `./example/index.html` for more information.

## Instructions for Publishing a private NPM package.

1. In the package root directory, run the npm init command and pass the scope to the scope flag:

    i. For an organization-scoped package, replace my-org with the name of your organization:
        `npm init --scope=@my-org`

    ii. For a user-scoped package, replace my-username with your username:
        `npm init --scope=@my-username`

2. On the command line, navigate to the root directory of your package.
    `cd /path/to/package`

3. To publish your private package to the npm registry, run:
    `npm publish`

To see your private package page, visit [https://npmjs.com/package/*package-name](https://npmjs.com/package/*package-name), replacing package-name* with the name of your package.

Visit [https://docs.npmjs.com/creating-and-publishing-private-packages](https://docs.npmjs.com/creating-and-publishing-private-packages) for more information.
