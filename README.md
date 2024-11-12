<p align="center">
  <img src="https://github.com/titaniumnetwork-dev/Alu/assets/99224452/d740378b-3fba-4470-8f06-3eefdae8a313" alt="AluLogo" width="250"/>
</p>

# Alu

Alu is a beautiful, functional, and sleek web proxy that prioritizes customization and ease of use.

![Code size](https://shields.io/github/languages/code-size/titaniumnetwork-dev/Alu?style=flat-square&logo=github)
![Star count](https://shields.io/github/stars/titaniumnetwork-dev/Alu?style=flat-square&logo=github)
![Made with coffee](https://img.shields.io/badge/made%20with-coffee-452515?style=flat-square&logo=coffeescript)

# Features

- 🌐 UV and Rammerhead support
- 🎨 Multiple Themes to choose from
- 🏬 Marketplace for Themes and Extensions
- 🕶 Multiple site cloaking options
- 🎮 50+ Games to choose from
- 🌎 Support for **6** Languages
- 🚀 High performance
- 🔍 Multiple Search Engines to pick from

# Deploying Alu (on Windows/Linux)

Deploying Alu is about as simple as it gets.

1. Open your terminal and type `git clone https://github.com/titaniumnetwork-dev/Alu --recurse-submodules`

2. Install pnpm with `npm i -g pnpm`.

3. Then simply run `pnpm i` to install all node_modules, and build the frontend with `pnpm run build`; this shouldn't take more than a couple seconds.

4. Finally, run `pnpm start` to actually serve Alu! It defaults to port 3000 for everything, but this can be specified in an env file.

Congrats! You should now be running your very own instance of Alu! 🎉

# But wait! I'm on a chromebook! How do I make my own instance on it?

Simple!

1. First, fork this repository into your Github account. You'll need it for later!

2. Now go to pipeops.io and register an account (If your school email doesn't work, try making a new email on a service such as tuta.com or proton.me [assuming those sites aren't blocked for you])

3. During your registration, it will ask where you want to create your server. Since you're likely broke as hell and don't have any money (which I'm assuming you are, since you're a person likely under the age of obtaining a driver's license.), select "On PipeOps".

4. Now it will ask you to customize your server "before takeoff", select the "Nova Sapa" plan, and then click "Proceed".

5. Congrats! You've set up a server to run Alu on! Now, for the next part, under the section where it says "Establish Your Cloud Presence: Account Setup", select Github, then once pipeops has auto-magically connected itself to your Github account and redirected back to the pipeops website, click the button that says "Proceed".

6. It will now ask you for a project type. Click the one labeled "Web".

7. Now, it will ask you for a "Git Provider Account" and to select or add an organization. Open the "Git Provider Account" dropdown and select "Github". A new button should now appear labeled "Install PipeOps Git", click the button and install it. Now, click on the "Select/Add Organization" dropdown and select your Github account, you should now see a list of all your repositories! Find the fork of Alu you created in it, and now click the button that says "Proceed".

8. You'll now be on a new screen labeled "Project Summary", don't worry about anything here! Just scroll down and click the "Proceed" button once again.

9. Thanks to the fact Alu is able to be dockerized, the build method on the new screen will automatically register with "Docker", and you'll want to use it to build the proxy, so don't change it!

10. You're now ready to deploy your proxy and make a new instince of Alu! Click "Deploy", and wait for couple minutes for the magical code hamsters of pipeops to make it.

11. Congrats! You've now made a new instance of Alu and are ready to start using it, if you've done everything right, you should have set up something like ([https://enormous-degree.pipeops.app/en/](url)!

-Written by Mister_Matey <3

> [!WARNING]
> Recursing all submodules will install [alu-games](https://github.com/wearrrrr/alu-games) as well. This repo contains _all_ games for Alu and is quite large! If you wish to skip it, simply remove `--recurse-submodules` from your clone command.

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
