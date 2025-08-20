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
  - package: ./local-plugins/internal-plugin-scaffolder-backend-module-azure-devbox-dynamic-0.1.0.tgz
    disabled: false
    integrity: "sha512-HkyQqorVfpGvES+O47j05/meB/QaLqxrge+lMH+B7e6rppbyOkE4gxLdlL9nPwaKPJiEBeV8Ak9EPqx3egwpEA=="
  - package: ./local-plugins/internal-plugin-azure-devbox-backend-dynamic-0.1.0.tgz
    disabled: false
    integrity: "sha512-zP+lQXL9l7QkHDFAeYoDfur1K/ILfxUy8cZncOazot8uUYROYjiixX3oaglsIHkouBCYsOfL9N1QfNDWCIxHXA=="
  - package: ./local-plugins/internal-plugin-azure-devbox-dynamic-0.1.0.tgz
    disabled: false
    integrity: "sha512-e5S6eGiY1pUpQYa5h/idOgDlMZoctrdsdtfRf/3IoGUs2zcve2J2AKYp707+5MXtuXtwd9GwWOjoulsx4JbMSw=="
    pluginConfig:

      dynamicPlugins:
        frontend:
          internal.plugin-azure-devbox:
            scaffolderFieldExtensions:
            - importName: ValidateKebabCaseFieldExtension
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