import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FeedbackTypeDdl } from 'src/app/core/fixed-values';
import { AdditionalPagesService } from 'src/app/core/services/additional-pages.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'preptm-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  feedbackTypeDdl = FeedbackTypeDdl
  form: FormGroup = this._fb.group({
    type: [4, Validators.required],
    message: [null, Validators.required]
  })
  isLoading = false
  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _additionalPagesService: AdditionalPagesService,
    private _router: Router,
    private _alert :AlertService
  ) { }


  ngOnInit(): void {
  }

  submit() {

    // if (!this._authService.isUserLoggedIn()) {
    //   this._alert.info("Please login first");
    //   return
    // }

    this.form.markAllAsTouched();
    let value = this.form.getRawValue();
    if (this.form.valid && value.message) {
      this.isLoading = true
      this._additionalPagesService.sendUserMessage(value).subscribe((resp) => {
        this.isLoading = false
        if (resp.isSuccess) {
          this._alert.info("Thank you for your feedback")
          this._router.navigateByUrl('/')
        } else {
          this._alert.info("We are facing technical issue right now, Please try again later.")
        }
      }, (err) => {
        this._alert.info("We are facing technical issue right now, Please try again later.")
        this.isLoading = false
      })
    }
  }
}
