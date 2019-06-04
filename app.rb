require 'sinatra'
require 'socket'

get '/' do
  Socket.gethostname
end