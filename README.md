![img](https://raw.githubusercontent.com/madeiramadeirabr/action-validate-deploy-date/32f828a3ff5f1956b2765da454851cbc36576ec3/img/action-validate-deploy-date.svg)
# action-validate-deploy-date

## Descrição:
Action que valida:
- Data do Deploy Agendado

## Contexto de negócio:
Irá compor a estrutura padrão que está sendo desenvolvida para o CI/CD da [MadeiraMadeira](https://github.com/madeiramadeirabr 'MadeiraMadeira'), sendo aplicável a todos os Projetos Novos (e "antigos").

## Squad:
[SRE-Architecture-Carpentry](https://github.com/orgs/madeiramadeirabr/teams/squad-sre-architecture-carpentry 'SRE-Architecture-Carpentry')

## Requisitos
1. Título da PR precisa ser validado pela action [`action-check-title-pr-pattern`](https://github.com/madeiramadeirabr/action-check-title-pr-pattern 'action-check-title-pr-pattern')
> Issue precisa ser setada entre parênteses no Título da Pull Request:
> _Exemplo:_ feat(**SRE-417**): implements Swagger.

2. A existência da Issue precisa ser validada pela action [`action-check-jira-issue`](https://github.com/madeiramadeirabr/action-check-jira-issue 'action-check-jira-issue')

3. Uso da Secret Global `GLOBALS_SRE_BASIC_AUTH_JIRA`

## Exemplo de uso (da action):
```yml
jobs:
  test:
    runs-on: ubuntu-latest
    name: check date deploy
    steps:      
        uses: madeiramadeirabr/action-validate-deploy-date@0.1.1
        with:
          domain: "<domain>"
          basic-auth: ${{ secrets.GLOBALS_SRE_BASIC_AUTH_JIRA }}
```
