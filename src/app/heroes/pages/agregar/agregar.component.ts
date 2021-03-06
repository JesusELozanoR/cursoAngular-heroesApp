import { Component } from '@angular/core';
import { Heroe, Publisher } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarComponent } from '../../componets/confirmar/confirmar.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [`
  img {
    width: 100%;
    border-radius: 5px;
  }
`
  ]
})
export class AgregarComponent {

heroe: Heroe={
      superhero:'',
      publisher: Publisher.DCComics,
      alter_ego: '',
      first_appearance: '',
      characters: ''
}
  constructor (private heroesService: HeroesService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar,
              public dialog: MatDialog){}

  ngOnInit():void{

      if(this.router.url.includes('editar')){
        this.activatedRoute.params
      .pipe(
        switchMap(({id}) => this.heroesService.getHeroePorId(id))
      )
        .subscribe(heroe=>this.heroe=heroe);
      } 
  }

publishers= [
  {
    id: 'DC Comics',
    desc: 'Editorial DC - Comics'
  },{
    id: 'Marvel Comics',
    desc: 'Editorial Marvel - Comics'
  }
  ];

  guardar(){
    if( this.heroe.superhero.trim().length === 0  ) {
      return;
    }

    if ( this.heroe.id ) {
      // Actualizar
      this.heroesService.actualizarHeroe( this.heroe )
        .subscribe( heroe => this.mostrarSnakbar('Registro actualizado'));

    } else {
      // Crear
      this.heroesService.agregarHeroe( this.heroe )
        .subscribe( heroe => {
          this.router.navigate(['/heroes/editar', heroe.id ]);
          this.mostrarSnakbar('Registro creado');
        })
    }
  }


  borrar(){
    const dialog = this.dialog.open( ConfirmarComponent, {
      width: '250px',
      data: this.heroe
    });

    dialog.afterClosed().subscribe(
      (result) => {

        if( result ) {
          this.heroesService.borrarHeroe( this.heroe.id! )
            .subscribe( resp => {
              this.router.navigate(['/heroes']);
            });
        }
        
      }
    )
  }


  mostrarSnakbar( mensaje: string ) {

    this.snackBar.open( mensaje, 'ok!', {
      duration: 2500
    });

  }
}
