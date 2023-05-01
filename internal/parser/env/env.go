package env

import (
	envvar "github.com/Netflix/go-env"
)

var config Config

type Config struct {
	ChromedpHost string `env:"CHROMEDP_HOST,required=true"`
}

func Load() (Config, error) {
	_, err := envvar.UnmarshalFromEnviron(&config)
	if err != nil {
		return config, err
	}

	return config, err
}