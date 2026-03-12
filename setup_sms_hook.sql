create or replace function public.custom_send_sms(phone text, otp_code text)
returns json
language plpgsql
security definer
as $$
declare
  result json;
  sms_api_id text := '2FF769B8-40C7-1797-5A04-9A1DF058223A';
  clean_phone text;
begin
  clean_phone := regexp_replace(phone, '[^0-9+]', '', 'g');
  if left(clean_phone, 1) = '+' then
    clean_phone := substring(clean_phone from 2);
  end if;
  
  select content::json into result
  from extensions.http_get(
    'https://sms.ru/sms/send?api_id=' || sms_api_id ||
    '&to=' || clean_phone ||
    '&msg=' || extensions.urlencode('Ваш код: ' || otp_code) ||
    '&json=1'
  );
  
  return result;
end;
$$;
