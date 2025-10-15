package com.example.TRANSFAGRI.Package;

import lombok.Data;

//ce qui vient du fontend lorsqu'il veut s'authentifier
@Data
public class AuthRequest {
    private String email;
    private String motpass;
}
