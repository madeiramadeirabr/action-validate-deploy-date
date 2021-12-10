![img](https://github.com/madeiramadeirabr/action-validate-deploy-date/blob/production/.github/Action_Validate_Date_Deploy.svg)

Example use:

```yml
jobs:
  test:
    runs-on: ubuntu-latest
    name: check date deploy
    steps:      
        uses: madeiramadeirabr/action-validate-deploy-date@v1
        with:
          url-jira: "url_jira"
          basic-auth: "basic_auth"
```