ExUnit.start

Mix.Task.run "ecto.create", ~w(-r ChatApp.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r ChatApp.Repo --quiet)
Ecto.Adapters.SQL.begin_test_transaction(ChatApp.Repo)

