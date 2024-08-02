<p align="center">

  <img src="https://github.com/titaniumnetwork-dev/Alu/assets/99224452/d740378b-3fba-4470-8f06-3eefdae8a313" alt="AluLogo" width="250"/>
</p>

# Alu

Alu is a beautiful, functional, and sleek web proxy, which focuses on customization and ease of use.

<img src="https://shields.io/github/languages/code-size/titaniumnetwork-dev/Alu?style=flat-square&logo=github"/> <img src="https://shields.io/github/stars/titaniumnetwork-dev/Alu?style=flat-square&logo=github"/> <img src="https://img.shields.io/badge/made%20with-coffee-452515?style=flat-square&logo=coffeescript"/>

# Features

- 🌐 UV and Rammerhead support
- 🎨 Multiple Themes to choose from
- 🏬 Marketplace for Themes and Extensions
- 🕶 Multiple site cloaking options
- 🎮 50+ Games to choose from
- 🌎 Support for **6** Languages
- 🚀 High performance
- 🔍 Multiple Search Engines to pick from

# Deploying Alu

Deploying Alu is about as simple as it gets.

1. Open your terminal and type `git clone https://github.com/titaniumnetwork-dev/Alu --recurse-submodules`

2. Install pnpm with `npm i -g pnpm`.

3. Then simply run `pnpm i` to install all node_modules, and then build the frontend with `pnpm run build`, this shouldn't take more than a couple seconds.

4. Finally, run `pnpm start` to actually serve Alu! It defaults to port 3000 for everything, but this can be specified in an env file.

Congrats! You should now be running your very own instance of Alu! 🎉

> [!WARNING]
> Recursing all submodules will install [alu-games](https://github.com/wearrrrr/alu-games) as well. This repo contains _all_ games for Alu, and is quite large! If you wish to skip it, simply remove `--recurse-submodules` from your clone command.

## What about Docker?

Alu can be easily dockerized with the `Dockerfile` provided in the repository. Simply run `docker build -t alu .` to build the image, and then `docker run -p 3000:3000 alu` to run the container, and you're good to go!

# Technologies

- Ultraviolet by Titanium Network
- Bare Server from TompHTTP
- Wisp Server Node by Mercury Workshop
- Rammerhead by binary-person
- Astro from astro.build
- Typescript
- ExpressJS
- Prettier
- ESLint

# License

Alu is licensed under the GNU GPL v3.0 License as of 2/9/2024.
