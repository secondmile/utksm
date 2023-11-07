<p align="center">
  <a href="https://admissions.utk.edu/">
    <img src="https://images.utk.edu/designsystem/2020/assets/i/icon-114x114.png" alt="Power T">
  </a>
</p>

<h3 align="center">University of Tennessee, Knoxville Admissions Child Theme</h3>

---

This is the child theme for UTK Admissions, developed by Second Mile: https://github.com/secondmile/utksm
The parent theme UTKWDS repositoryis located at this URL: https://github.com/utkwdn/utkwds

---

The theme is built from the `src` directory, using the directions listed under [Installing this project](#installing-this-project). When built, all parent theme files will be in the `build` directory. This directory can be copied or symlinked into a WordPress site's `wp-content/themes/` directory and activated like any other theme.

The child theme is heavily based on the parent theme but has some small differences. The child theme's files when built can be copied or symlinked into a WordPress site's `wp-content/themes/` directory and activated like any other theme. Given that the parent theme is coming from one development team (New City) and this child theme is being developed by another team (Second Mile), that is how our local workflows have been established. The repositories for each live in their own directories, are built in their own directories, and then copied into a third instance locally where the two are combined.

## Parent-Child Conflicts/Considerations
One limitation of parent/child development as of this writing, is patterns. Gutenberg patterns read from the child pattern directory actually override/ignore those in the parent. To account for this, one must separately combine the files from parent and child to include everyone's pattern work. Consequently, any patterns found within this child theme should begin with the prefix `sm-` and reside in the `patterns-sm` directory in order to keep things somewhat organized and to help automate combining both batches of files without loss of work and to reduce confusion.

## Installing this project

### Step 1, Installing the requirementshttps://github.com/secondmile/utksm

The UTKSM uses Node and Gulp to compile and compress Javascript and CSS from source files. To modify this project, you must use Node 14 and Gulp.

1. Not required, but highly recommended. [Install NVM by following these instructions](https://github.com/nvm-sh/nvm#installing-and-updating). **Mac Users**: If you get an "nvm: command not found" error after running the install script (and you likely will), be sure to [follow the troubleshooting steps](https://github.com/nvm-sh/nvm#troubleshooting-on-macos).
2. Install Node.js **Important**: [Install using NVM (recommended)](https://www.linode.com/docs/guides/how-to-install-use-node-version-manager-nvm/#using-nvm-to-install-node).

### Step 2, Installing the this project

1. Download or `git clone` this project by typing `git clone git@github.com:secondmile/utksm.git`.
2. In your terminal, change to the new `/utksm/` directory.
3. Ensure you are running Node.js 14 prior to installation, by typing `node -v`
4. Type `npm install` to install dependencies.

### Step 3, Building the Plugin(s)

For each plugin in the `/plugins/` directory, check for a `ReadMe` file. Perform any build steps indicated in the plugin documentation.

---

## Developing or building the theme (automated)
### Automated to build with child and parent directories to a third combined build (WP Engine)
If you want to just build the site, skip to the next section. If you want to set up a build process that will respect the parent theme, child theme, AND account for patterns, follow along:

1. Set up the parent theme by using the steps outlined here: https://github.com/utkwdn/utkwds/blob/main/README.md
2. Set up this child theme using the steps outlined in Step 2 (above)
3. Set up a 3rd instance of the actual site. As of this writing it is hosted on WP Engine and the Local App is a nice choice for cloning this instance down and establishing a connection of pulling/pushing to the environments found there. (more on how to do that here: https://localwp.com/connect-to-wp-engine/ ; once connected Local will have a Connect tab on the left you can use to pull a site down and push back up)

The build_utksm_child.sh file within the base repo directory contains the commands to combine builds. It requires you input your local directories for the child theme and final build. You will need to save this file locally and update it.

4. Update these directories to reflect your directory structure:
`target_directory="/Users/USERNAME/PATH_TO_DIRECTORY/utksm"`
`destination_dir="/Users/USERNAME/PATH_TO_DIRECTORY/utk-admissions/app/public/wp-content/themes"`

5. In terminal, navigate to the directory of the shell script and make it executable by entering:
`chmod +x build_utksm_child.sh`

6. Optional (but recommended): Tie this to an alias so it can be easily executed
- Open to your shell config file (thix can be in a number of places like `~/.zshrc`)
- Define the alias that will execute the shell file `alias build-utksm='/path/to/build_utksm_child.sh'`
- Save the file, restart your terminal
- Test by typing `build-utksm` in terminal (doesn't matter what directory you happen to be in now)
 
 ---
## Developing or building the theme (manually, not connected to WP Engine)

The NPM commands are:

- `npm run dev` runs continually and watches the `\src\` directory for changes. When you change a file, it rebuilds the theme in the `\build\` directory.
- `npm run build` will build a testing theme.
- `npm run dist` will minimize all images and css and javascript for production and place a production ready version of the theme in the `\dist\` directory.

**Note**: The JS and CSS is edited in the framework project. The theme references [javascript](https://images.utk.edu/designsystem/v1/latest/assets/js/utk.js) and [css](https://images.utk.edu/designsystem/v1/latest/assets/css/style.css) files on the images server.

---

## Plugins
The plugin, `utk-wds-navigation-blocks`, is located in the `/plugins/` directory.
It enables two block types: breadcrumbs and navigation menus.

If the plugin is not installed and active, the site will be unaffected except that any breadcrumbs
or menus generated with its blocks will be absent. Consult the `ReadMe.md` file in the plugin's directory for more information about using the UTK navigation blocks.