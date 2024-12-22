import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Messagedto } from '../model/messagedto';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit {
  messages: Messagedto[] = [];
  newMessage: string = '';
  email: string = '';
  connected: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {  }


  getMessages(email: string): void {
  this.http.get<Messagedto[]>('http://localhost:8080/conversation/' + email)
      .subscribe(
        (data) => this.messages = data,
        (error) => console.error('Error fetching messages', error)
      );
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const message = { content: this.newMessage, senderEmail: this.email };
      this.http.post('http://localhost:8080/message/send', message)
        .subscribe(
          () => {
            this.getMessages(this.email);
            this.newMessage = '';
            this.refreshMessages(); 
          },
          (error) => console.error('Error sending message', error)
        );
    }
  }

  connect(email: string): void {
    if (this.email.trim()) {
      this.http.post('http://localhost:8080/connect', email)
        .subscribe(
          () => {
            this.email = email;
            this.getMessages(email);
            this.connected = true;
          },
          (error) => console.error('Error connecting', error)
        );
    }
  }

  deconnect(email: string): void {
    if (this.email.trim()) {
      const email = { content: this.email };
      this.http.post('http://localhost:8080/deconnect', email)
        .subscribe(
          () => {
            this.email = '';
            this.getMessages('deconnect');
            this.connected = false;
          },
          (error) => console.error('Error connecting', error)
        );
    }
  }

  refreshMessages(): void {
    setInterval(() => {
      this.getMessages(this.email);
    }, 3000);
  }

}
