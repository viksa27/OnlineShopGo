import {Component} from '@angular/core';
import {loadStripe} from '@stripe/stripe-js';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {LoaderService} from '../../services/loader.service';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  standalone: false,
  styleUrl: './payment-form.component.css'
})
export class PaymentFormComponent {
  stripe: any;
  elements: any;
  private clientSecret: string | null = null;

  sub$ = new Subscription();

  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              private loaderService: LoaderService) {
  }

  async ngOnInit() {
    this.stripe = await loadStripe(environment.stripePublishingKey);
    this.sub$.add(
      this.route.queryParams.subscribe(params => {
        if (params['secret']) {
          this.clientSecret = params['secret'];
          this.initStripe();
        }
      })
    );
  }

  ngOnDestroy() {
    this.sub$.unsubscribe();
  }

  initStripe() {
    const appearance = {theme: 'stripe'};
    this.elements = this.stripe.elements({appearance, clientSecret: this.clientSecret});

    const paymentElement = this.elements.create('payment');
    paymentElement.mount('#payment-element');
  }

  submitPayment() {
    this.loaderService.show();

    this.stripe
      .confirmPayment({
        elements: this.elements,
        confirmParams: {return_url: 'http://localhost:4200/success'},
      })
      .then((result: any) => {
        this.loaderService.hide();
        if (result.error) {
          const message = document.getElementById('error-message');
          if (message) message.textContent = result.error.message;
        }
      });
  }
}
