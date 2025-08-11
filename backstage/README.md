# [Backstage](https://backstage.io)

This is your newly scaffolded Backstage App, Good Luck!

To start the app, run:

```sh
yarn install
yarn dev
```


# How Configure dynamic-plugins.yaml

```
plugins:
  - package: ./local-plugins/internal-plugin-azure-devbox-backend-dynamic-0.1.0.tgz
    disabled: false
    integrity: "sha512-mvbKFCa/OksCES2ONZ/iH+JJEJUk2Ef7Jf0dhjAyt8uPiqvQVfZNBCnl7rdXi1CRLodLDKhuIZYYIZmUiv6fIg=="
  - package: ./local-plugins/internal-plugin-azure-devbox-dynamic-0.1.0.tgz
    disabled: false
    integrity: "sha512-8T1MH7If2GNCMe/vYvP6rR7lARYZ37glIQypEyqw5z1Ai3b7EjZ3BM7+YWZyhxs0QYpH/af+jHWT6fjpQNLB5w=="
    pluginConfig:
      dynamicPlugins:
        frontend:
          internal.plugin-azure-devbox:
            appIcons:
            - name: computerIcon
              importName: ComputerIcon
            dynamicRoutes:
              - path: /azure-devbox
                importName: AzureDevboxPage
                menuItem:
                  text: 'Azure Dev Box'
                  icon: computerIcon  

```