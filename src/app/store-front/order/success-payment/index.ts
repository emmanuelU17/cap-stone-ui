import {WebhookMetadata} from "@/app/store-front/order";
import {Cart} from "@/app/store-front/shop/shop.helper";

export interface SuccessfulPayment extends WebhookMetadata {
  carts: Cart[];
}
