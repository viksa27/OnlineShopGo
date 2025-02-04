package utils

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client

func InitRedis() {
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})
}

func BlacklistToken(token string, expiry time.Duration) error {
	ctx := context.Background()
	return RedisClient.Set(ctx, token, "blacklisted", expiry).Err()
}

func IsTokenBlacklisted(token string) bool {
	ctx := context.Background()
	_, err := RedisClient.Get(ctx, token).Result()
	return err == nil
}
