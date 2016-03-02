defmodule ChatApp.ChatView do
  use ChatApp.Web, :view

  def render_private_script do
    """
    <script>
    console.log("this is an extra script which is called from the ChatApp.ChatView");
    </script>
    """
  end

end
