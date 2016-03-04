defmodule ChatApp.Repo.Migrations.AddRememberMeTokenToUserTable do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :remember_me_token, :text
    end
  end
end
