import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent {

  monsters;
  monster = JSON.parse(localStorage.getItem('monster'));
  token = JSON.parse(localStorage.getItem('token'));
  role: string = this.monster.role;
  newMonsterToAdd: string;
  loading: boolean = false;
  changeRoleLoading: boolean = false;

  constructor(private http: HttpClient, private router: Router) {

  }

  ngOnInit() {
    this.loading = true;
    console.log(this.monster.friends);
    const config = {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    };
    this.http.get('/api/monster', config).subscribe((result:any) => {
      this.monsters = result.monsters;
      this.loading = false;
    }, (error) => {
      console.log(error);
      this.loading = false;
    });
  }

  setNewMonster(event) {
    this.newMonsterToAdd = event.target.value;
  }

  isFriend(id) {
    let array = this.monster.friends;
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      if (element._id === id) {
        return true;
      }
    }
    return false;
  }

  removeFriend(id) {
    this.loading = true;
    const config = {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    };
    this.http.put('/api/monster/remove', {monsterId: id}, config).subscribe((result:any) => {
      console.log(result);
      this.monster = result;
      localStorage.setItem('monster', JSON.stringify(this.monster));
      setTimeout(() => {
        this.loading = false;
      }, 300);
    }, (error) => {
      console.log(error);
      setTimeout(() => {
        this.loading = false;
      }, 300);
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }

  generateAvatar(login) {
    return `https://robohash.org/${login}?set=set2 `;
  }

  changeRole(event) {
    this.changeRoleLoading = true;
    this.role = event.target.value;
    const config = {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    };
    this.http.put('/api/monster/', {role: event.target.value}, config).subscribe((result:any) => {
      console.log(result);
      this.monster = result;
      localStorage.setItem('monster', JSON.stringify(this.monster));
      setTimeout(() => {
        this.changeRoleLoading = false;
      }, 300);
    }, (error) => {
      console.log(error);
      setTimeout(() => {
        this.changeRoleLoading = false;
      }, 300);
    });
  }

  addFriend(login) {
    this.loading = true;
    const config = {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    };
    this.http.put('/api/monster/add', {login: login}, config).subscribe((result:any) => {
      console.log(result);
      this.monster = result;
      localStorage.setItem('monster', JSON.stringify(this.monster));
      setTimeout(() => {
        this.loading = false;
      }, 300);
    }, (error) => {
      console.log(error);
      setTimeout(() => {
        this.loading = false;
      }, 300);
    });
  }

}
