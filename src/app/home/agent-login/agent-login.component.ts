import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from '../auth.service';
import { DataService } from '../data.service';



@Component({
  selector: 'app-agent-login',
  templateUrl: './agent-login.component.html',
  styleUrls: ['./agent-login.component.css']
})
export class AgentLoginComponent implements OnInit {

  login: FormGroup;
  agentName;

  constructor( private formBuilder: FormBuilder, private routes: Router, private _authService: AuthService, private dataService: DataService) { }


  sendMessage(): void {
    // send message to subscribers via observable subject
    this.dataService.sendMessage('Message from Home Component to App Component!');
}

  clearMessages(): void {
    // clear messages
    this.dataService.clearMessages(); 
  }


  ngOnInit() {
    if(this._authService.agentLoggedIn())
      this.routes.navigate(['agent/dashboard'])

    this.login = this.formBuilder.group({
      agentUsername: ['', Validators.required],
      agentPassword: ['', Validators.required]
    });
  }

  onAgentSubmit(){
    console.log(this.login.value);
    this._authService.agentlogin(this.login.value)
      .subscribe(
        res=> {
          localStorage.setItem('token',res.token); 
          this.dataService.sendMessage(res.agent);
          
          
          localStorage.setItem('ID',res.agent._id )

          

          localStorage.setItem('agentName',JSON.stringify(res.agent))

          this.agentName = localStorage.getItem('agentName');
          console.log("agentLOcal Value",this.agentName);

          this.routes.navigate(['agent/dashboard'])
        
        },
        err=> console.log("error",err)
      )
      // this.routes.navigate(['admin/dashboard'], { replaceUrl: true });

  }

  }


