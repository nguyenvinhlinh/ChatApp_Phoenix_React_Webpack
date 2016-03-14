defmodule ChatApp.ChatView do
  use ChatApp.Web, :view

  def render("user_chatting_info.js", %{conn: conn}) do
    """
    <script>
    window.user_chatting_info = {
      username: "#{conn.assigns.current_user.username}",
      chat_token: "#{conn.assigns.current_user.chat_token}"
    };
    </script>
    """
  end
end
