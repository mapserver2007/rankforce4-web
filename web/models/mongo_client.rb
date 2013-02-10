# -*- coding: utf-8 -*-
require 'net/https'
require 'json'
require 'models/utils'

module RankForce
  class HTTPClient

    include RankForce::Utils

    HOST = 'api.mongolab.com'
    PATH = '/api/1/databases/%s/collections/%s'

    def initialize(file)
      config      = load_config(file)
      database    = config['database']
      collection  = config['collection']
      @apikey     = config['apikey']
      @path       = PATH % [database, collection]
      @header     = {'Content-Type' => "application/json"}
      @query      = {}
      @query_json = {}
    end

    def https_start
      Net::HTTP.version_1_2
      https = Net::HTTP.new(HOST, 443)
      https.use_ssl = true
      https.verify_mode = OpenSSL::SSL::VERIFY_NONE
      https.start { yield https }
    end

    def get
      @query[:apiKey] = @apikey
      @query[:q] = @query_json.to_json unless @query_json.empty?
      qs = @query.map {|k, v| "#{k}=#{v}"}.join("&")
      url = @path + "?#{qs}"
      https_start do |https|
        JSON.parse(https.get(url).body).reverse
      end
    end
  end

  class MongoClient < HTTPClient
    def board(name)
      @query_json[:board] = name.to_s
      self
    end

    def limit(n)
      @query[:l] = n.to_s
      self
    end

    def sort(item, order)
      @query[:s] = {"#{item}" => order.to_i}.to_json
      self
    end
  end
end
