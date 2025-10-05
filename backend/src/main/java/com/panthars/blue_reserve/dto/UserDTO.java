package com.panthars.blue_reserve.dto;

import java.util.Iterator;

import com.panthars.blue_reserve.model.Role;
import com.panthars.blue_reserve.model.User;

public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String avatar;
    private boolean enabled;
    private Long managerId; // or managerName if you prefer
    private Integer blueDollars;
    private String managerName;
    private String role;
    private String token;
    private Boolean autoApprove;

    public UserDTO(User user, String token) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.avatar = user.getAvatar();
        this.enabled = user.isEnabled();
        this.managerId = user.getManager() != null ? user.getManager().getId() : null;
        this.managerName = user.getManager() != null ? user.getManager().getName() : null;
        this.blueDollars = user.getBlueDollars();
        Iterator<Role> iterator = user.getRoles().iterator();

        if (iterator.hasNext()) {
            this.role = iterator.next().getName();
        }
        this.token = token;
        this.autoApprove = user.isAutoApprove();
       
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }

    public Integer getBlueDollars() {
        return blueDollars;
    }

    public void setBlueDollars(Integer blueDollars) {
        this.blueDollars = blueDollars;
    }

    public String getManagerName() {
        return managerName;
    }

    public void setManagerName(String managerName) {
        this.managerName = managerName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Boolean getAutoApprove() {
        return autoApprove;
    }

    public void setAutoApprove(Boolean autoApprove) {
        this.autoApprove = autoApprove;
    }
   
}

