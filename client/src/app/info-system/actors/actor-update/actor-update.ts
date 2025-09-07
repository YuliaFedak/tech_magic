import {Component, OnInit} from '@angular/core';
import {ActorsApi} from '../../../services/actors-api';
import {ActivatedRoute, Router} from '@angular/router';
import {IActor} from '../../actor.config';
import {map, Observable, tap} from 'rxjs';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'app-actor-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './actor-update.html',
  styleUrl: './actor-update.scss'
})
export class ActorUpdate implements OnInit{
  actor$!: Observable<IActor>
  actorForm!: FormGroup;
  actorId!: string | null;
  constructor(
    private actorApi: ActorsApi,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.actorId = this.activatedRouter.snapshot.paramMap.get('id')
    if (!this.actorId) {
      this.router.navigate(['actors']);
      return;
    }

    this.actorForm = new FormGroup({
      last_name: new FormControl('',
        [Validators.required,
          Validators.minLength(3)]),
      first_name: new FormControl('',
        [Validators.required,
          Validators.minLength(3)]),
      middle_name: new FormControl('',
        [Validators.required,
          Validators.minLength(3)]),
      rank: new FormControl('', [Validators.minLength(3)]) ,
      experience: new FormControl(''),
    });

    this.actor$ = this.actorApi.getOneActor(this.actorId).pipe(
      tap(actor => {
        this.actorForm.patchValue(actor);
      })
    );
  }

  public get actorValidation() {
    return this.actorForm.controls
  }

  onSubmit() {
    if (this.actorForm.valid) {
      const actor: IActor = this.actorForm.value
      const keys = Object.keys(actor) as (keyof IActor)[];
      keys.forEach((key: keyof IActor) => {
        if (!actor[key]) {
          delete actor[key];
        }
      });
      if (this.actorId) {
        this.actorApi.updateActor(this.actorId, actor).subscribe({
          next: (res) => {
            console.log('Actor created:', res);
            // alert about success creation
            this.snackBar.open('Actor successfully updated!', "Close", {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['custom-snackbar']
            })
          },
          error: (err) => {
            console.error('Error updating actor:', err)
            this.snackBar.open(err, 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['custom-snackbar-invalid-form']
            });
          }
        });
      }
    } else {
      this.snackBar.open('Failed to update actor', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['custom-snackbar-invalid-form']
      });
    }
  }

  public goBack() : void {
    this.router.navigate(['/actors'])
  }
}
