package com.a305.travelmaker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;

@EnableJpaAuditing
@EnableRedisRepositories
@SpringBootApplication
public class TravelmakerApplication {

    public static void main(String[] args) {
        SpringApplication.run(TravelmakerApplication.class, args);
    }

}
