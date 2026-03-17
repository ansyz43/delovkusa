create or replace function public.send_sms_hook(event jsonb)
returns jsonb
language plpgsql
security definer
as $$
declare
  phone text;
  otp_code text;
  sms_api_id text := current_setting('app.sms_api_id', true);
  clean_phone text;
  request_id bigint;
  sms_message text;
  encoded_msg text;
begin
  phone := event->'user'->>'phone';
  otp_code := event->'sms'->>'otp';
  
  clean_phone := regexp_replace(phone, '[^0-9+]', '', 'g');
  if left(clean_phone, 1) = '+' then
    clean_phone := substring(clean_phone from 2);
  end if;

  sms_message := 'Ваш код подтверждения: ' || otp_code;
  
  -- URL-encode the message manually (replace spaces and colons)
  encoded_msg := replace(sms_message, ' ', '%20');
  encoded_msg := replace(encoded_msg, ':', '%3A');
  -- Handle Cyrillic URL encoding via pg_net POST instead
  
  -- Use pg_net to make async HTTP GET request to sms.ru
  select net.http_get(
    url := 'https://sms.ru/sms/send',
    params := jsonb_build_object(
      'api_id', sms_api_id,
      'to', clean_phone,
      'msg', sms_message,
      'json', '1'
    )
  ) into request_id;

  return jsonb_build_object(
    'status', 'ok'
  );
end;
$$;

grant execute on function public.send_sms_hook to supabase_auth_admin;
revoke execute on function public.send_sms_hook from authenticated, anon, public;
