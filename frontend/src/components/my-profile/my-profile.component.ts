import {Component, OnDestroy} from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { EditProfileRequest } from '../../models/request/EditProfileRequest'
import {HttpClient} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {User} from '../../models/User'
import { PaymentCard } from '../../models/PaymentCard';
import { CreateCardRequest } from '../../models/request/CreateCardRequest';
import { DisplayPaymentCard } from '../../models/DisplayPaymentCard';
import {PaymentCardService } from '../../services/card/card.service'
import { GetCardsResponse } from '../../models/response/GetCardsResponse';
import { AddressService } from '../../services/address/address.service';
import { Address } from '../../models/Address';
import { AddressRequest } from '../../models/request/AddressRequest';


@Component({
  selector: 'app-my-profile',
  standalone: false,

  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnDestroy {
  profile: EditProfileRequest = {
    email: '',
    name: '',
    surname: ''
  };

  currentUser: User | null = null;
  paymentCards: DisplayPaymentCard[] = [];
  newCard: PaymentCard = {
    ID: 0,
    UserId: 0,
    Name: '',
    Number: '',
    Cvc: '',
    ExpiryMonth: 0,
    ExpiryYear: 0,
  };
  
  addresses: Address[] = [];
  newAddress: AddressRequest = {
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: ''
  };


  showAddCardForm = false;
  showAddAddressForm = false;
  editAddressMode = false;
  editingAddressId: number | null = null;
  
  sub$ = new Subscription();

  constructor(
    private userService: UserService,
    private paymentCardService: PaymentCardService,
    private addressService: AddressService,
    private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.userService.getUser().subscribe({
      next: (data) => {
        this.currentUser = data;
        if (this.currentUser == null) return;

        this.profile.email = this.currentUser.Email;
        this.profile.name = this.currentUser.Name;
        this.profile.surname = this.currentUser.Surname;

        this.loadPaymentCards();
        this.loadAddresses();
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Error fetching user.';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }

  ngOnDestroy() {
    this.sub$.unsubscribe();
  }

  loadAddresses() {
    this.addressService.getUserAddresses().subscribe({
      next: (response) => {
        this.addresses = response.addresses;
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Error fetching addresses.';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }

  deleteAddress(addressId: number) {
    this.addressService.deleteAddress(addressId).subscribe({
      next: () => {
        this.addresses = this.addresses.filter(address => address.ID !== addressId);
        this.snackBar.open('Address deleted successfully!', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Error deleting address.';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }

  editAddress(address: Address, addressId: number) {
    this.newAddress.street = address.Street;
    this.newAddress.city = address.City
    this.newAddress.country = address.Country;
    this.newAddress.state = address.State;
    this.newAddress.zip_code = address.ZipCode;
    this.editingAddressId = addressId;
    this.editAddressMode = true;
    this.showAddAddressForm = true;
  }
  
  onAddAddress() {
    this.addressService.createAddress(this.newAddress).subscribe({
      next: (address) => {
        this.addresses.push(address);
        this.snackBar.open('Address added successfully!', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
        this.newAddress = { street: '', city: '', state: '', zip_code: '', country: '' };
        this.showAddAddressForm = false;
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Error adding address.';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }

  onEditAddress() {
    if (this.editingAddressId == null) { return; }
    
    this.addressService.updateAddress(this.editingAddressId, this.newAddress).subscribe({
      next: (updatedAddress) => {
        // Replace the old address with the updated one
        this.addresses = this.addresses.map(addr => addr === updatedAddress ? updatedAddress : addr);
        this.snackBar.open('Address updated successfully!', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });

        this.resetAddressForm();
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Error updating address.';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }

  onSaveAddress() {
    if (this.editAddressMode && this.editingAddressId !== null) {
      this.onEditAddress();
    } else {
      this.onAddAddress();
    }
  }
  
  resetAddressForm() {
    this.newAddress = { street: '', city: '', state: '', zip_code: '', country: '' };
    this.editingAddressId = null;
    this.editAddressMode = false;
    this.showAddAddressForm = false;
  }

  loadPaymentCards() {
    if (!this.currentUser) return;
    
    this.paymentCardService.getUserCards().subscribe({
      next: (response: GetCardsResponse) => {
        this.paymentCards = response.cards.map(card => ({
          ...card,
          showFullNumber: false, // Add the 'showFullNumber' field to each card
        }));
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Error fetching payment cards.';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }

  deleteCard(cardId: number) {
    this.paymentCardService.deleteCard(cardId).subscribe({
      next: () => {
        this.paymentCards = this.paymentCards.filter(card => card.ID !== cardId);
        this.snackBar.open('Card deleted successfully!', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Error deleting card.';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }

  onAddCard() {
    if (!this.currentUser) return;

    const req: CreateCardRequest = {
      name: this.newCard.Name,
      number: this.newCard.Number,
      cvc: this.newCard.Cvc,
      expiry_month: this.newCard.ExpiryMonth,
      expiry_year: this.newCard.ExpiryYear
    };
    
    this.paymentCardService.createCard(req).subscribe({
      next: (card) => {
        this.paymentCards.push({ ...card, showFullNumber: false });
        this.snackBar.open('Card added successfully!', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
        this.newCard = { ID: 0, UserId: 0, Name: '', Number: '', Cvc: '', ExpiryMonth: 0, ExpiryYear: 0};
        this.showAddCardForm = false;
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Error adding card.';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }

  onSubmit() {
    this.sub$.add(
      this.userService.updateProfile(this.profile).subscribe({
        next: (response) => {
          this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
          localStorage.removeItem('email');
          localStorage.setItem('email', this.profile.email);
        },
        error: (error) => {
          const errorMessage = error?.error?.error || 'Error updating profile. Please try again.';
          this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
        }
      })
    );
  }


}
