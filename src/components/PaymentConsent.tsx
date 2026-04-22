import React, { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

/**
 * Хук для получения согласия пользователя с офертой и политикой конфиденциальности
 * перед совершением платежа.
 *
 * Использование:
 *   const { requestConsent, ConsentDialog } = usePaymentConsent();
 *   const handleBuy = async () => {
 *     if (!(await requestConsent())) return;
 *     // ... код создания платежа
 *   };
 *   return (<>...<ConsentDialog /></>);
 */
export function usePaymentConsent() {
  const [open, setOpen] = useState(false);
  const [agreeOffer, setAgreeOffer] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const resolverRef = useRef<((v: boolean) => void) | null>(null);

  const requestConsent = useCallback((): Promise<boolean> => {
    setAgreeOffer(false);
    setAgreePrivacy(false);
    setOpen(true);
    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleConfirm = () => {
    if (!agreeOffer || !agreePrivacy) return;
    setOpen(false);
    resolverRef.current?.(true);
    resolverRef.current = null;
  };

  const handleCancel = () => {
    setOpen(false);
    resolverRef.current?.(false);
    resolverRef.current = null;
  };

  const ConsentDialog = useCallback(
    () => (
      <Dialog open={open} onOpenChange={(o) => { if (!o) handleCancel(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Подтверждение покупки</DialogTitle>
            <DialogDescription>
              Перед переходом к оплате подтвердите, что вы ознакомлены с условиями.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-start gap-3">
              <Checkbox
                id="agree-offer"
                checked={agreeOffer}
                onCheckedChange={(v) => setAgreeOffer(v === true)}
                className="mt-0.5"
              />
              <Label htmlFor="agree-offer" className="text-sm leading-relaxed cursor-pointer font-normal">
                Я ознакомлен(а) и принимаю условия{" "}
                <Link to="/offer" target="_blank" className="text-pink-600 underline hover:text-pink-700">
                  Публичной оферты
                </Link>{" "}
                и{" "}
                <Link to="/terms" target="_blank" className="text-pink-600 underline hover:text-pink-700">
                  Пользовательского соглашения
                </Link>
              </Label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="agree-privacy"
                checked={agreePrivacy}
                onCheckedChange={(v) => setAgreePrivacy(v === true)}
                className="mt-0.5"
              />
              <Label htmlFor="agree-privacy" className="text-sm leading-relaxed cursor-pointer font-normal">
                Я даю согласие на обработку персональных данных в соответствии с{" "}
                <Link to="/privacy" target="_blank" className="text-pink-600 underline hover:text-pink-700">
                  Политикой конфиденциальности
                </Link>
              </Label>
            </div>

            <p className="text-xs text-muted-foreground pt-2 border-t">
              Оплата проходит через защищённый сервис ЮKassa (АО «ЮMoney»).
              Данные вашей карты сайту не передаются и не сохраняются.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
              Отмена
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!agreeOffer || !agreePrivacy}
              className="bg-pink-600 hover:bg-pink-700 text-white w-full sm:w-auto"
            >
              Перейти к оплате
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
    [open, agreeOffer, agreePrivacy]
  );

  return { requestConsent, ConsentDialog };
}

export default usePaymentConsent;
