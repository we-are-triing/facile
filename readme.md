# Facile studio

Facile is Italian for simple and easy. We wanted to make a modern, open CMS that is simple and easy for the developers, the content creators, and the translators. So many of the CMS options are ancient in terms of software. We wanted to make a component based CMS for component based code.

To come, a description of the architecture, and a diagram of it. Including the different parts to understand. Like, template, regions, content components vs. view components.

## Studio breakdown

Rather than building facile as a single app, I wanted to make it modular so that if you wanted to switch out parts you can. In fact it is encouraged. It is built on top of swagger for REST APIs and GraphQL for those who can use that. The app is seperated into several different products.

### Facile

The facile repo is the core CMS. It is the editor and what you think of when you think of facile. It has all the parts and peices for editing, translating, and maintaining all of your content. It is really the hub for everything else. This also has a system of feedback and approvals from editors and designers for content delivery, and translation is a first class citizen here with interfaces designed to make the translation process a breeze!

### [Facile - Media](https://github.com/LuceStudio/facile-media)

This is the media arm of content manegment. It is where you can maintain all of your images, videos, and icons. It allows you to dynamically deliver images to what aspect ratio you need cropping on the fly and caching the variations. It will also optimize the assets for delivery.

### [Facile - Store](https://github.com/LuceStudio/facile-store)

The store is where the data is housed. The CMS mearly captures the input then sends the data along. It was designed this way so that it would be simple to change out data systems if you needed a different one than the default MongoDB. All you have to do is create an adaptor that matches the contracts and away you go. We are planning on creating several adaptors for other data systems like PostgreSQL.

### [Facile - Reports](https://github.com/LuceStudio/facile-reports)

The reporting system integrates with google analytics and lighthouse to show your site preformance and usage metrics. It is built to allow integrations into other systems aswell like if you need a heatmap or clickmap integration.

### [Facile - front end](https://github.com/LuceStudio/facile-example-fe)

The front end is highly exchangeable. This is the part that we expect most everyone to create their own. If fact, we even have a marketplace for them. Find one you like and set up your site. If you want to swap out front ends later, we even have a migration tool to help move sets of components between front ends.
