defmodule ChatApp.ChatView do
  use ChatApp.Web, :view

  def render("user_chatting_info.js", %{username: username, chat_token: chat_token}) do
    """
    <script>
    window.user_chatting_info = {
      username: "#{username}",
      chat_token: "#{chat_token}"
    };
    </script>
    """
  end
end
