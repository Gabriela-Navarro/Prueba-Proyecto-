import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';
import {MatDialog, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { RegistroComponent } from '../registro/registro.component';
import { AfterViewChecked } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.scss']
})
export class IngresoComponent{
  constructor(private router:Router,private backend1: BackendService,public dialog: MatDialog,public snackBar: MatSnackBar){ }
  user={
    id_user:0,
    usuario: "",
    contrase :""
  }
 
  usuar:string="";
  pass:string="";

  ingresarbase(){
    console.log(this.user);
    if(this.user.usuario != '' && this.user.contrase !=''){
    this.backend1.ingresarMenu(this.user).subscribe((x)=>{
      const id = x.datos[0].id_user;
        this.backend1.obtenerUsuario(id).subscribe(x=>{
          localStorage.setItem('ids',String(id));
          if(x.datos[0].usuario == "AdminUser"){
            console.log(x.datos[0].usuario )
            this.snackBar.open('¡Ingreso exitoso! 🚀✨😊', 'Cerrar', {
              duration: 4000,
              panelClass: ['mensaje-exito']
            });
            this.router.navigateByUrl('/agregar');
            usuario: "";
            contrase :"";
            }else{
              this.snackBar.open('¡Ingreso exitoso! 🚀✨😊', 'Cerrar', {
                duration: 4000,
                panelClass: ['mensaje-exito']
              });
              this.router.navigateByUrl('/home');
              usuario: "";
              contrase :"";}
            })  
    },(error)=>{
      this.borrar();
      console.error('Error:', error);
      this.snackBar.open('¡Oops! No se pudo ingresar. 😞🚫', 'Cerrar', {
        duration: 4000,
        panelClass: ['mensaje-error']
      });
    });
  }else{
    this.snackBar.open('Por favor, ingrese todos los campos correctamente.', 'Cerrar', {
        duration: 4000,
        panelClass: ['mensaje-error']
    });
  }
  }
  borrar(){
    this.user.usuario= "";
    this.user.contrase ="";
  }
  openRegistrar(){
    const dialogRef = this.dialog.open(RegistroComponent, {restoreFocus: false});
  }

}
