defmodule ChatApp.Repo.Migrations.AddUserTable do
  use Ecto.Migration

  def up do
    create table(:user) do
      add(:username, :string, size: 25)
      add(:encrypted_password, :string)
      timestamps
    end
  end

  def down do
    drop table(:user)
  end
end
