Feature: Portfolio
    As a user
    I want to view the assets I own

    Scenario: Check exchange account
        Given a provided exchange account
        When I fetch the account balance
        Then I can see my assets quantity
