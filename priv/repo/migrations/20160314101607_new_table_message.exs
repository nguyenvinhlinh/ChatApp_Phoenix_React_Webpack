defmodule ChatApp.Repo.Migrations.NewTableMessage do
  use Ecto.Migration
  
  def change do
    create table(:messages) do
      add(:group_id, :integer, null: false)
      add(:user_id, :integer, null: false)
      add(:message, :text, null: false)
      timestamps
    end
  end
end
