create or replace function public.send_sms_hook(event jsonb)
returns jsonb
language plpgsql
security definer
as $$
declare
  phone text;
  otp_code text;
  sms_api_id text := '2FF769B8-40C7-1797-5A04-9A1DF058223A';
  clean_phone text;
  request_id bigint;
begin
  phone := event->'user'->>'phone';
  otp_code := event->'sms'->>'otp';
  
  clean_phone := regexp_replace(phone, '[^0-9+]', '', 'g');
  if left(clean_phone, 1) = '+' then
    clean_phone := substring(clean_phone from 2);
  end if;

  select net.http_get(
    url := 'https://sms.ru/sms/send?api_id=' || sms_api_id ||
           '&to=' || clean_phone ||
           '&msg=' || extensions.urlencode('Ваш код подтверждения: ' || otp_code) ||
           '&json=1'
  ) into request_id;

  return jsonb_build_object(
    'status', 'ok'
  );
end;
$$;

grant execute on function public.send_sms_hook to supabase_auth_admin;
revoke execute on function public.send_sms_hook from authenticated, anon, public;
