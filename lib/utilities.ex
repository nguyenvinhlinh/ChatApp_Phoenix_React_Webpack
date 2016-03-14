defmodule ChatApp.Utilities do
  def convert_keyword_to_map(keyword_list) when is_list(keyword_list) do
    append_fn = fn(element, acc) ->
      {key, value} = element
      cond do
        is_binary(value) ->
          Map.put(acc, key,value)
        is_tuple(value) ->
          {message, replacement_words} = value
        replace = fn(ele, acc) ->
          {k, v} = ele
          String.replace(acc, "%{#{k}}", "#{v}")
        end
        error_message = Enum.reduce(replacement_words, message, replace)
        Map.put(acc, key,error_message)
      end
    end
    Enum.reduce(keyword_list, %{}, append_fn)
  end

  def generate_random_token(token_length) do
    token_length
    |> :crypto.strong_rand_bytes()
    |> Base.url_encode64
    |> binary_part(0, token_length)
  end
end
