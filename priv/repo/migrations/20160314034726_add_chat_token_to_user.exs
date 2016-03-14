defmodule ChatApp.Repo.Migrations.AddChatTokenToUser do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add(:chat_token, :string)
    end
  end
end
